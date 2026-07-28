"use server";

import { createClient } from "@/utils/supabase/server";
import { scrapeProduct } from "@/lib/firecrawl";
import { normalizeCurrency } from "@/utils/currency";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function addProduct(formData) {
  const url = formData.get("url");

  if (!url) {
    return { error: "URL is required" };
  }

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { error: "Not authenticated" };
    }

    const productData = await scrapeProduct(url);

    if (!productData.productName || !productData.currentPrice) {
      console.log(productData, "productData");
      return { error: "Could not extract product information from this URL" };
    }

    const newPrice = parseFloat(productData.currentPrice);
    const currency = normalizeCurrency(productData.currencyCode);

    const { data: existingProduct } = await supabase
      .from("products")
      .select("id, current_price")
      .eq("user_id", user.id)
      .eq("url", url)
      .single();

    const isUpdate = !!existingProduct;

    const { data: product, error } = await supabase
      .from("products")
      .upsert(
        {
          user_id: user.id,
          url,
          name: productData.productName,
          current_price: newPrice,
          currency: currency,
          image_url: productData.productImageUrl,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "user_id,url",
          ignoreDuplicates: false,
        }
      )
      .select()
      .single();

    if (error) throw error;

    const shouldAddHistory =
      !isUpdate || existingProduct.current_price !== newPrice;

    if (shouldAddHistory) {
      await supabase.from("price_history").insert({
        product_id: product.id,
        price: newPrice,
        currency: currency,
      });
    }

    revalidatePath("/");
    revalidatePath("/products");
    return {
      success: true,
      product,
      message: isUpdate
        ? "Product updated with latest price!"
        : "Product added successfully!",
    };
  } catch (error) {
    console.error("Add product error:", error);
    return { error: error.message || "Failed to add product" };
  }
}

export async function deleteProduct(productId) {
  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", productId);

    if (error) throw error;

    revalidatePath("/");
    revalidatePath("/products");
    return { success: true };
  } catch (error) {
    return { error: error.message };
  }
}

export async function getProducts(page = 1, pageSize = 12) {
  try {
    const supabase = await createClient();

    const { count } = await supabase
      .from("products")
      .select("*", { count: "exact", head: true });

    const total = count || 0;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data: products, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) throw error;
    if (!products || products.length === 0) {
      return { products: [], total, page, pageSize, totalPages };
    }

    const productIds = products.map((p) => p.id);
    const { data: priceHistory } = await supabase
      .from("price_history")
      .select("product_id, price, checked_at")
      .in("product_id", productIds)
      .order("checked_at", { ascending: false });

    const historyMap = {};
    for (const entry of priceHistory || []) {
      if (!historyMap[entry.product_id]) historyMap[entry.product_id] = [];
      if (historyMap[entry.product_id].length < 2) {
        historyMap[entry.product_id].push(entry);
      }
    }

    const productsWithChange = products.map((product) => {
      const history = historyMap[product.id] || [];
      const currentPrice = parseFloat(product.current_price);
      let priceChange = null;
      if (history.length >= 2) {
        const prevPrice = parseFloat(history[1].price);
        priceChange = ((currentPrice - prevPrice) / prevPrice) * 100;
      }
      return { ...product, price_change: priceChange };
    });

    return { products: productsWithChange, total, page, pageSize, totalPages };
  } catch (error) {
    console.error("Get products error:", error);
    return { products: [], total: 0, page, pageSize, totalPages: 1 };
  }
}

export async function getProduct(productId) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return null;

    const { data: product, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", productId)
      .eq("user_id", user.id)
      .single();

    if (error) throw error;
    if (!product) return null;

    const { data: priceHistory } = await supabase
      .from("price_history")
      .select("product_id, price, checked_at")
      .eq("product_id", product.id)
      .order("checked_at", { ascending: false });

    const currentPrice = parseFloat(product.current_price);
    let priceChange = null;
    if (priceHistory && priceHistory.length >= 2) {
      const prevPrice = parseFloat(priceHistory[1].price);
      priceChange = ((currentPrice - prevPrice) / prevPrice) * 100;
    }

    return { ...product, price_change: priceChange };
  } catch (error) {
    console.error("Get product error:", error);
    return null;
  }
}

export async function getPriceHistory(productId) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("price_history")
      .select("*")
      .eq("product_id", productId)
      .order("checked_at", { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Get price history error:", error);
    return [];
  }
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/");
  redirect("/");
}
